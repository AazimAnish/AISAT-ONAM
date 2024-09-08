// components/toastButton.js
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ToastActionButton = ({ href, onClick, children }) => (
  <Link href={href} passHref>
    <Button onClick={onClick}>
      {children}
    </Button>
  </Link>
);

export default ToastActionButton;
