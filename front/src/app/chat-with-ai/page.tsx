import AiChatBox from "@/components/AiChatBox";
import ServiceLayout from "@/components/layouts/ServiceLayout";
import { getServerSession } from "next-auth";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";

export default async function ChatWithAIPage() {
  const session: CustomSession | null = await getServerSession(authOptions);

  return (
    <ServiceLayout session={session}>
      <AiChatBox />
    </ServiceLayout>
  );
}
