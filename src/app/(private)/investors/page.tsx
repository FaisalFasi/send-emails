import React from "react";
import CreateInvestorsForm from "@/components/CreateInvestorsForm/CreateInvestorsForm";
import PostInvestorData from "./postInvestorData";

const CreateInvestors = () => {
  return (
    <div className="w-full h-full bg-gray-300 p-4">
      {/* <CreateInvestorsForm /> */}
      <PostInvestorData />
    </div>
  );
};

export default CreateInvestors;
