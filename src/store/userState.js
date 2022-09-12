import { atom } from "recoil";
import { useRecoilState } from "recoil";

const userStatus = atom({
  key: "userState",
  default: null,
});

export const useUserState = () => {
  const [userState, setUserState] = useRecoilState(userStatus);
  return [userState, setUserState];
};
