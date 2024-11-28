import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
      {/* <Image src="/images/logos/dark-logo.svg" alt="logo" height={70} width={174} priority /> */}
      <Image src="/images/logos/haier-logo.png" alt="logo" height={55} width={173} priority />
    </LinkStyled>
  );
};

export default Logo;
