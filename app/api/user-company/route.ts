import { getUserCompany } from "@/actions/dashboard/company/company";

export async function GET() {
  const company = await getUserCompany();
  return new Response(JSON.stringify(company), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
