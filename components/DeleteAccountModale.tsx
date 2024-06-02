import { Button } from "./ui/button";

export type DeleteAccountModaleProps = {
  delete: (value: boolean) => void;
  handleOnDeleteAccount: () => void;
};

export const DeleteAccountModale = ({
  delete: setDelete,
  handleOnDeleteAccount,
}: DeleteAccountModaleProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-lg font-bold text-black text-center">
          Are you sure ?
        </h2>
        <p className="text-center text-black text-sm">{`(all posts and informations will be deleted)`}</p>
        <div className="flex gap-4 mt-4 w-full justify-center">
          <Button
            onClick={() => setDelete(false)}
            variant="outline"
            className="bg-red-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleOnDeleteAccount}
            variant="outline"
            className="bg-green-600"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
