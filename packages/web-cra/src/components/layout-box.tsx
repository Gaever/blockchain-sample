import Box, { BoxProps } from "@mui/material/Box";
import React, { useEffect, useRef, useState } from "react";
import { Layout } from "../types";

export interface LayoutBoxProps extends BoxProps {
  children?: (layout: Layout) => React.ReactNode;
}

function LayoutBox(props: LayoutBoxProps) {
  const selfRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>({ width: 0, height: 0 });
  // const [resizeListener, setResizeListener] =
  // 	useState<() => void | undefined>();

  useEffect(() => {
    setLayout({
      width: selfRef.current?.clientWidth || 0,
      height: selfRef.current?.clientHeight || 0,
    });
  }, [selfRef.current?.clientWidth, selfRef.current?.clientHeight]);

  // useEffect(() => {
  // if (selfRef.current && !resizeListener) {
  // 	const handler = () => {
  // 		setLayout({
  // 			width: selfRef.current?.clientWidth || 0,
  // 			height: selfRef.current?.clientHeight || 0,
  // 		});
  // 	};
  // 	window.addEventListener("resize", handler);
  // 	setResizeListener(handler);
  // }
  // return () => {
  // 	if (resizeListener) {
  // 		window?.removeEventListener("resize", resizeListener);
  // 	}
  // };
  // }, [resizeListener]);

  return (
    <Box {...props} ref={selfRef}>
      {props?.children?.(layout)}
    </Box>
  );
}

export default LayoutBox;
