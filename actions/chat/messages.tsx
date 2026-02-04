"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"   // لو تستعمل NextAuth

// 🟢 Get Messages for the user (User & Admin)
export async function getMessages() {
    const session = await auth()
    if (!session?.user?.id) return []

    const userId = session.user.id

    const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" }
    })
    if (!admin) return []

    return await prisma.message.findMany({
        where: {
            OR: [
                { senderId: userId, receiverId: admin.id },
                { senderId: admin.id, receiverId: userId },
            ]
        },
        orderBy: { createdAt: "asc" }
    })
}

// Send Message User → Admin
export async function sendMessage(content: string) {
    const session = await auth()
    if (!session?.user) return null

    const userId = session.user.id
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } })
    if (!admin) return null

    return await prisma.message.create({
        data: {
            content,
            senderId: userId,
            receiverId: admin.id,
        }
    })
}

// Admin Send → User
export async function adminSendMessage(userId: string, content: string) {
    const session = await auth()
    if (!session?.user?.id) return null

    const admin = await prisma.user.findUnique({
        where: { id: session.user.id },
    })
    if (!admin || admin.role !== "ADMIN") return null

    return prisma.message.create({
        data: {
            content,
            senderId: admin.id,
            receiverId: userId,
        },
    })
}


// 🟦 2) Send Message from USER → ADMIN
export async function sendMessageToAdmin(content: string) {
    const session = await auth()
    if (!session?.user?.id) return null

    const userId = session.user.id
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } })
    if (!admin) return null

    const message = await prisma.message.create({
        data: {
            content,
            senderId: userId,
            receiverId: admin.id,
        }
    })

    return {
        ...message,
        isAdmin: false // لأن user أرسل
    }
}


// 🟨 4) Mark messages as READ
export async function markMessagesAsRead() {
    const session = await auth()
    if (!session?.user?.id) return null

    const adminId = process.env.ADMIN_ID || "admin_id_here"

    return await prisma.message.updateMany({
        where: {
            senderId: adminId,
            receiverId: session.user.id,
            read: false,
        },
        data: { read: true },
    })
}

// 🟢 Get messages between User & Admin
// export async function getMessagesWithAdmin() {
//     const session = await auth()
//     if (!session?.user) return []

//     const userId = session.user.id

//     const admin = await prisma.user.findFirst({
//         where: { role: "ADMIN" }
//     })

//     if (!admin) return []

//     const messages = await prisma.message.findMany({
//         where: {
//             OR: [
//                 { senderId: userId, receiverId: admin.id },
//                 { senderId: admin.id, receiverId: userId },
//             ],
//         },
//         orderBy: { createdAt: "asc" },
//     })

//     return messages
// }

export async function getMessagesWithAdmin() {
    const session = await auth()
    if (!session?.user?.id) return []

    const userId = session.user.id

    // نجيب admin
    const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
        select: { id: true }
    })
    if (!admin) return []

    // ✅ USER يقرا messages متاع ADMIN
    await prisma.message.updateMany({
        where: {
            senderId: admin.id,
            receiverId: userId,
            read: false
        },
        data: { read: true }
    })

    // نرجّع messages
    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: userId, receiverId: admin.id },
                { senderId: admin.id, receiverId: userId }
            ]
        },
        orderBy: { createdAt: "asc" },
        include: {
            sender: true
        }
    })

    return messages
}


// 🟢 Get messages between Admin and specific User (for admin chat page)
// export async function getAdminMessagesWithUser(userId: string) {
//     const session = await auth()
//     if (!session?.user?.id) return []

//     // Verify that the current user is an admin
//     const currentUser = await prisma.user.findUnique({
//         where: { id: session.user.id }
//     })
//     if (!currentUser || currentUser.role !== "ADMIN") return []

//     const messages = await prisma.message.findMany({
//         where: {
//             OR: [
//                 { senderId: currentUser.id, receiverId: userId },
//                 { senderId: userId, receiverId: currentUser.id },
//             ],
//         },
//         orderBy: { createdAt: "asc" },
//     })

//     return messages
// }
export async function getAdminMessagesWithUser(userId: string) {
    const session = await auth()
    if (!session?.user?.id) return []

    // Verify admin
    const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id }
    })
    if (!currentUser || currentUser.role !== "ADMIN") return []

    // ✅ 1. هنا نحطّ mark as read
    await prisma.message.updateMany({
        where: {
            senderId: userId,            // user بعث
            receiverId: currentUser.id,  // للإدمن
            read: false
        },
        data: { read: true }
    })

    // ✅ 2. بعد نجيب messages
    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: currentUser.id, receiverId: userId },
                { senderId: userId, receiverId: currentUser.id },
            ],
        },
        orderBy: { createdAt: "asc" },
    })

    return messages
}


// 🟢 Get all users except admin (for admin chat page)
// export async function getUsersForAdminChat() {
//     const users = await prisma.user.findMany({
//         where: { role: { not: "ADMIN" } },
//         include: {
//             receivedMessages: {
//                 where: {
//                     read: false,
//                     sender: {
//                         role: { not: "ADMIN" }
//                     }
//                 }
//             },
//             company: true,
//         },
//         orderBy: { createdAt: "desc" },
//     })

//     return users.map(u => ({
//         id: u.id,
//         name: u.name,
//         email: u.email,
//         image: u.image,
//         role: u.role,
//         unreadCount: u.receivedMessages.length,
//         isOnline: u.isOnline,
//         companyName: u.company?.name || null,
//     }))
// }

// export async function getUsersForAdminChat() {
//     const users = await prisma.user.findMany({
//         where: { role: { not: "ADMIN" } },
//         select: {
//             id: true,
//             name: true,
//             email: true,
//             image: true,
//             role: true,
//             isOnline: true,
//             company: { select: { name: true } },
//             _count: {
//                 select: {
//                     receivedMessages: {
//                         where: {
//                             read: false,
//                             sender: { role: { not: "ADMIN" } }
//                         }
//                     }
//                 }
//             }
//         },
//         orderBy: { createdAt: "desc" },
//     })

//     return users.map(u => ({
//         id: u.id,
//         name: u.name,
//         email: u.email,
//         image: u.image,
//         role: u.role,
//         unreadCount: u._count.receivedMessages,
//         isOnline: u.isOnline,
//         companyName: u.company?.name || null,
//     }))
// }

// actions/chat/messages.ts
export async function getUsersForAdminChat() {
    const users = await prisma.user.findMany({
        where: { role: { not: "ADMIN" } },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            isOnline: true,
            lastSeen: true,       // <- ADD THIS
            company: { select: { name: true } },
            receivedMessages: { where: { read: false }, select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        image: u.image,
        role: u.role,
        isOnline: u.isOnline,
        lastSeen: u.lastSeen,             // <- ADD THIS
        unreadCount: u.receivedMessages.length,
        companyName: u.company?.name || null,
    }));
}

// 🟥 Delete message by ID
export async function deleteMessageById(messageId: string) {
    const session = await auth()
    if (!session?.user?.id) return null

    const userId = session.user.id

    const message = await prisma.message.findUnique({
        where: { id: messageId },
    })

    if (!message) return null

    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
    })

    // السماح فقط لصاحب الرسالة أو ADMIN
    if (message.senderId !== userId && currentUser?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    await prisma.message.delete({
        where: { id: messageId },
    })

    return { success: true }
}

// 🟦 Update message by ID
export async function updateMessageById(messageId: string, content: string) {
    const session = await auth()
    if (!session?.user?.id) return null

    const userId = session.user.id

    const message = await prisma.message.findUnique({
        where: { id: messageId },
    })

    if (!message) return null

    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
    })

    // فقط صاحب الرسالة أو ADMIN
    if (message.senderId !== userId && currentUser?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    const updated = await prisma.message.update({
        where: { id: messageId },
        data: {
            content,
        },
    })

    return updated
}
