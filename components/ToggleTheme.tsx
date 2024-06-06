"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

const ToggleTheme = () => {
  const { theme, setTheme } = useTheme();
  const toggleFunc = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant={"outline"}
      size={"icon"}
      className="flex justify-center w-16 h-12 dark:text-white dark:bg-gray-800 bg-gray-200 rounded-lg  "
      onClick={() => toggleFunc()}
    >
      <Moon className=" w-16 scale-100 dark:scale-0" />
      <Sun className=" w-16 scale-0 dark:scale-100" />
    </Button>
  );
};

export default ToggleTheme;
