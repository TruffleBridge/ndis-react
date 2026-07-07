import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getNavTitle } from "../constants/navigation";
import { useMenu } from "./menuContext";

/** Keeps legacy menu context in sync with the current route. */
export function MenuRouteSync() {
  const location = useLocation();
  const { setSelectedMenu } = useMenu();

  useEffect(() => {
    setSelectedMenu(getNavTitle(location.pathname));
  }, [location.pathname, setSelectedMenu]);

  return null;
}
