import { atom } from "recoil";
import { useRecoilState } from "recoil";

const orgStatus = atom({
  key: "orgState",
  default: null,
});

export const useOrgState = () => {
  const [orgState, setOrgState] = useRecoilState(orgStatus);
  return [orgState, setOrgState];
};
