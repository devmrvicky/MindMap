import Logo from "../utils/Logo";

const Navbar = () => {
  return (
    <nav className="w-full h-16 gap-4 bg-white dark:bg-[#171717] shadow-md flex justify-between items-center px-4">
      <Logo className="max-w-fit" />
    </nav>
  );
};

export default Navbar;
