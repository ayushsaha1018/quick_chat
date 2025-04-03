import { Request, Response } from "express";
import prisma from "../config/db.config.js";

interface GroupUserType {
  groupId: string;
  userId: number;
  name: string;
}

class ChatGroupUserController {
  static async index(req: Request, res: Response) {
    try {
      const { group_id } = req.query;
      const users = await prisma.groupUsers.findMany({
        where: {
          group_id: group_id as string,
        },
      });

      return res.json({ message: "Data fetched successfully!", data: users });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }

  static async store(req: Request, res: Response) {
    try {
      const body: GroupUserType = req.body;
      
      // Check if user is already a member
      const existingMember = await prisma.groupUsers.findFirst({
        where: {
          group_id: body.groupId,
          name: body.name,
        },
      });

      if (existingMember) {
        return res.status(400).json({ message: "User is already a member of this group" });
      }

      const user = await prisma.groupUsers.create({
        data: {
          group_id: body.groupId,
          name: body.name,
          role: "MEMBER",
          status: "OFFLINE"
        },
      });

      return res.json({ message: "User joined successfully!", data: user });
    } catch (error) {
      console.error("Error joining group:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }
}

export default ChatGroupUserController;
