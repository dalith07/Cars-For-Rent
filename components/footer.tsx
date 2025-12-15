"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { Car } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-linear-to-b from-[#0a0a0f] via-black to-[#050505] text-gray-400 border-t border-gray-800 ">
            <div className="max-w-6xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-4">
                {/* Brand */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl font-bold text-blue-500 mb-4"><Car /></h2>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Streamline your repair process with AI-powered estimates and
                        effortless collaboration between drivers and garages.
                    </p>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Quick Links
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-purple-400 transition">Home</Link></li>
                        <li><Link href="/about" className="hover:text-purple-400 transition">About</Link></li>
                        <li><Link href="/services" className="hover:text-purple-400 transition">Services</Link></li>
                        <li><Link href="/contact" className="hover:text-purple-400 transition">Contact</Link></li>
                    </ul>
                </motion.div>

                {/* Resources */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/faq" className="hover:text-purple-400 transition">FAQ</Link></li>
                        <li><Link href="/blog" className="hover:text-purple-400 transition">Blog</Link></li>
                        <li><Link href="/support" className="hover:text-purple-400 transition">Support</Link></li>
                        <li><Link href="/privacy" className="hover:text-purple-400 transition">Privacy Policy</Link></li>
                    </ul>
                </motion.div>

                {/* Social Media */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Follow Us
                    </h3>
                    <div className="flex gap-4">
                        <Link
                            href="#"
                            className="hover:text-blue-400 ">
                            <FaFacebook size={"24"} />
                        </Link>

                        <Link
                            href="#"
                            className="hover:text-purple-400 ">
                            <FaInstagram size={"24"} />
                        </Link>

                        <Link
                            href="#"
                            className="hover:text-purple-400 ">
                            <FaTiktok size={"24"} />
                        </Link>

                        <Link
                            href="https://wa.me/21612345678"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-400">
                            <FaWhatsapp size={"24"} />
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-800 text-center py-6 text-sm text-gray-500">
                © {new Date().getFullYear()} <span className="text-white font-semibold">Cars For Rent</span>. All rights reserved.
            </div>
        </footer>
    );
}
