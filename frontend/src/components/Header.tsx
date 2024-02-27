import { FC } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  account: string;
}

const Header: FC<HeaderProps> = ({ account }) => {
  const onClickSignOut = () => {
    localStorage.removeItem("token");

    window.location.reload();
  };
  return (
    <header className="max-w-screen-md mx-auto flex items-center p-4 border-b-2 broder-b-black">
      {account ? (
        <div>
          <span className="font-semibold">{account}</span>님 환영합니다!
          <Link className="button-style" to="/create">
            Create
          </Link>
          <button className="button-style" onClick={onClickSignOut}>
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <Link className="font-bold button-style" to="/sign-in">
            Sign In
          </Link>
          <Link className="ml-4 font-bold button-style" to="/sign-up">
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
