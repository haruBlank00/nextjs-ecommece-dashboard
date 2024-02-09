import SizeForm from "./size-form";

const SizePage = async () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={[]} />
      </div>
    </div>
  );
};

export default SizePage;
