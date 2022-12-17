import React from "react";
import { useIntl } from "react-intl";

import Link from "@components/Link";

import { CommonProps } from "../../type";

interface SectionProps extends CommonProps {
  to?: string;
  title: string;
  id?:string;
}

export default function Section(props: SectionProps) {
  const { to, title, children,className = "",id = "section.see-all" } = props;
  const { formatMessage } = useIntl();

  return <section className={"mb-24 " + className}>
    <div className="flex w-full justify-between items-center">
      <h1 className="text-base text-2xl">{title}</h1>
      {to &&
        <Link to={to} className="text-xs font-bold">
          {formatMessage({ id })}
        </Link>}
    </div>
    <div>
      {children}
    </div>
  </section>;
}