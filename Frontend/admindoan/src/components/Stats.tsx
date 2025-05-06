import SingleStats from "./SingleStats";

const Stats = () => {
  return (
    <div>
      <h2 className="text-3xl text-whiteSecondary font-bold mb-7">Tổng quan về số dư</h2>
      <div className="flex justify-start gap-x-20 max-[1800px]:flex-wrap gap-y-10 mr-1 max-[1352px]:gap-x-10 max-[1050px]:mr-5">
        <SingleStats title="Đơn hàng mới" value="56" />
        <SingleStats title="Khuyến mãi" value="51,393" />
        <SingleStats title="Doanh thu" value="99,825" />
      </div>
    </div>
  );
};
export default Stats;
