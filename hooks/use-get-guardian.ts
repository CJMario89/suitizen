import useGetCard from "./use-get-card";

const useGetGuardian = () => {
  const { data } = useGetCard();
  const card = data?.[0];
  console.log(data);
};

export default useGetGuardian;
