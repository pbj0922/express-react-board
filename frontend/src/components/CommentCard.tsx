import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { IComment } from "./Comment";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import ko from "date-fns/locale/ko";
import { useMe } from "../hooks";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import axios from "axios";

interface CommentCardProps {
  comment: IComment;
  comments: IComment[];
  setComments: Dispatch<SetStateAction<IComment[]>>;
}

const CommentCard: FC<CommentCardProps> = ({
  comment,
  comments,
  setComments,
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [updateComment, setUpdateComment] = useState<string>(comment.content);
  const [content, setContent] = useState<string>(comment.content);

  const { account, getMe } = useMe();

  const onClickEdit = async () => {
    try {
      if (!updateComment || updateComment === comment.content) return;

      const response = await axios.put(
        `${process.env.REACT_APP_BACK_URL}/comment/${comment.id}`,
        {
          content: updateComment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setContent(response.data.content);
      setIsEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACK_URL}/comment/${comment.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const temp = comments.filter((v, i) => v.id !== response.data);

      setComments(temp);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    setContent(comment.content);
    setUpdateComment(comment.content);
  }, [comment]);

  return (
    <li className="flex mb-2">
      <span className="w-20 text-right font-bold">{comment.user.account}</span>{" "}
      님
      <span className="grow pl-4">
        {isEdit ? (
          <input
            className="border-2 focus:outline-none focus:border-blue-300 px-1 rounded-md text-sm"
            type="text"
            value={updateComment}
            onChange={(e) => setUpdateComment(e.target.value)}
          />
        ) : (
          content
        )}
      </span>
      {account === comment.user.account && (
        <span className="flex">
          {isEdit && (
            <button
              onClick={onClickEdit}
              className="flex items-center text-sm mr-1 button-style"
            >
              <FiEdit className="mr-1" size={16} /> Edit
            </button>
          )}
          <button
            onClick={() => setIsEdit(!isEdit)}
            className="flex items-center text-sm button-style ml-1"
          >
            {isEdit ? (
              "Cancel"
            ) : (
              <>
                <FiEdit className="mr-1" size={16} /> Edit
              </>
            )}
          </button>
          <button
            className="flex items-center text-sm ml-2 button-style"
            onClick={onClickDelete}
          >
            <FiTrash2 className="mr-1" size={16} /> Delete
          </button>
        </span>
      )}
      <span className="w-32 pl-2">
        {formatDistanceToNow(new Date(comment.createdAt), {
          locale: ko,
          addSuffix: true,
        })}
      </span>
    </li>
  );
};

export default CommentCard;
