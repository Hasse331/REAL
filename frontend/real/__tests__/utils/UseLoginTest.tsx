import React from "react";
import useLoginCheck from "../../app/utils/useLoginCheck";

type TestComponentWithStateProps = {
  setStateTest?: boolean;
};

export default function TestComponent({
  setStateTest,
}: TestComponentWithStateProps) {
  const [loggedIn, setLoggedIn] = useLoginCheck();

  if (setStateTest) {
    setLoggedIn(false);
  }

  return <div>{`Logged in: ${loggedIn}`}</div>;
}
