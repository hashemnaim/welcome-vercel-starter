import { forwardRef } from "react";
import { Link, useLocation } from "@/lib/router-compat";
import { cn } from "@/lib/utils";

type NavLinkCompatProps = Omit<
  React.ComponentPropsWithoutRef<typeof Link>,
  "className"
> & {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  end?: boolean;
};

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  (
    {
      className,
      activeClassName,
      pendingClassName: _pendingClassName,
      end,
      to,
      ...props
    },
    ref,
  ) => {
    const { pathname } = useLocation();
    const target = typeof to === "string" ? to : "";
    const isActive = end
      ? pathname === target
      : target !== "" &&
        (pathname === target || pathname.startsWith(`${target}/`));

    return (
      <Link
        ref={ref}
        to={to}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
