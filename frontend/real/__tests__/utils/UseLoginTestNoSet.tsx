import React from "react";
import useLoginCheck from "../../app/utils/useLoginCheck";

export default function TestComponentWithNoSet() {
  const loggedIn = useLoginCheck("noSet");
  return <div>{`Logged in: ${loggedIn}`}</div>;
}
