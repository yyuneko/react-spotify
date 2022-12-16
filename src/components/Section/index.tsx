import React from "react";
import { useIntl } from "react-intl";

import Link from "@components/Link";

import { CommonProps } from "../../type";

interface SectionProps extends CommonProps {
  to?: string;
  title: string;
}

export default function Section(props: SectionProps) {
  const { to, title, children } = props;
  const { formatMessage } = useIntl();

  return <section className="mb-24">
    <div className="flex w-full justify-between items-center">
      <h1 className="text-base text-2xl">{title}</h1>
      {to &&
        <Link to={to} className="text-xs font-bold">
          {formatMessage({ id: "section.see-all" })}
        </Link>}
    </div>
    <div>
      {children}
    </div>
  </section>;
}