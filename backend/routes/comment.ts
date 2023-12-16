import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "./auth";

const router = express.Router();

const client = new PrismaClient();

const select = {
  id: true,
  createdAt: true,
  content: true,
  userId: true,
  user: {
    select: {
      account: true,
    },
  },
  postId: true,
};

router.post("/", verifyToken, async (req: any, res) => {
  try {
    const { content, postId } = req.body;
    const { user } = req;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        message: "Not exist content.",
      });
    }

    if (isNaN(postId)) {
      return res.status(400).json({
        message: "Post id is not a number.",
      });
    }

    const post = await client.post.findUnique({
      where: {
        id: +postId,
      },
    });

    if (!post) {
      return res.status(400).json({
        message: "Not exist post.",
      });
    }

    const comment = await client.comment.create({
      data: {
        content,
        userId: user.id,
        postId: post.id,
      },
      select,
    });

    return res.json(comment);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error.",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const { postId } = req.query;

    if (!postId || isNaN(+postId)) {
      return res.status(400).json({
        message: "Post id is not a number.",
      });
    }

    const post = await client.post.findUnique({
      where: {
        id: +postId,
      },
    });

    if (!post) {
      return res.status(400).json({
        message: "Not exist post.",
      });
    }

    const comments = await client.comment.findMany({
      where: {
        postId: +postId,
      },
      select,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(comments);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error.",
    });
  }
});

// 댓글 수정
router.put("/:commentId", verifyToken, async (req: any, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const { user } = req;

    if (!commentId || isNaN(+commentId)) {
      return res.status(400).json({
        message: "Not exist comment id.",
      });
    }

    if (!content || commentId.trim().length === 0) {
      return res.status(400).json({
        message: "Not exist content.",
      });
    }

    const existComment = await client.comment.findUnique({
      where: {
        id: +commentId,
      },
    });

    if (!existComment || existComment.userId !== user.id) {
      return res.status(400).json({
        message: "Not exist comment.",
      });
    }

    const updatedComment = await client.comment.update({
      where: {
        id: +commentId,
      },
      data: {
        content,
      },
      select,
    });

    return res.json(updatedComment);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error.",
    });
  }
});

// 댓글 삭제
router.delete("/:commentId", verifyToken, async (req: any, res) => {
  try {
    const { commentId } = req.params;
    const { user } = req;

    if (!commentId || isNaN(+commentId)) {
      return res.status(400).json({
        message: "Not exist comment id.",
      });
    }

    const existComment = await client.comment.findUnique({
      where: {
        id: +commentId,
      },
    });

    if (!existComment || existComment.userId !== user.id) {
      return res.status(400).json({
        message: "Not exist comment.",
      });
    }

    const deletedComment = await client.comment.delete({
      where: {
        id: +commentId,
      },
    });

    return res.json(deletedComment.id);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error.",
    });
  }
});

export default router;
