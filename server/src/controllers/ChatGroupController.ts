import { Request, Response } from "express";
import prisma from "../config/db.config.js";

class ChatGroupController {
  static async index(req: Request, res: Response) {
    try {
      const user = req.user;
      const groups = await prisma.chatGroup.findMany({
        where: {
          user_id: user.id,
        },
        orderBy: {
          created_at: "desc",
        },
      });
      return res.json({ data: groups });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }

  static async publicGroups(req: Request, res: Response) {
    try {
      const groups = await prisma.chatGroup.findMany({
        orderBy: {
          created_at: "desc",
        },
      });
      return res.json({ data: groups });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res.status(400).json({ message: "Invalid group ID format" });
      }

      const group = await prisma.chatGroup.findUnique({
        where: {
          id: id,
        },
      });

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      return res.json({ data: group });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }

  static async store(req: Request, res: Response) {
    try {
      const body = req.body;
      if (!body?.title) {
        return res.status(400).json({ message: "Title is required" });
      }

      const group = await prisma.chatGroup.create({
        data: {
          title: body.title,
          user_id: body.user_id,
        },
      });

      return res.status(201).json({ data: group });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body;

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res.status(400).json({ message: "Invalid group ID format" });
      }

      const group = await prisma.chatGroup.findUnique({
        where: { id },
      });

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      await prisma.chatGroup.update({
        where: { id },
        data: body,
      });

      return res.json({ message: "Group updated successfully!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }

  static async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res.status(400).json({ message: "Invalid group ID format" });
      }

      const group = await prisma.chatGroup.findUnique({
        where: { id },
      });

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      await prisma.chatGroup.delete({
        where: { id },
      });

      return res.json({ message: "Chat Deleted successfully!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }
}

export default ChatGroupController;
