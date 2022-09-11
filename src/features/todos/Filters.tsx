import { Select } from "@chakra-ui/react";
type Props = {
  setFilter: Function;
  isLoading: boolean;
};
const Filters = ({ setFilter, isLoading }: Props): JSX.Element => {
  const filters = ["All", "Active", "Completed"];

  if (isLoading == true) {
    return (
      <Select
        variant="filled"
        size="xs"
        onChange={(e) => setFilter(parseInt(e.target.value))}
        placeholder="Loading.."
      />
    );
  }
  return (
    // shorthand using the `Flex` component
    <Select
      variant="filled"
      size="xs"
      onChange={(e) => setFilter(parseInt(e.target.value))}
    >
      {filters.map((item, index) => {
        return (
          <option value={index} key={item}>
            {" "}
            {item}
          </option>
        );
      })}
    </Select>
  );
};

export default Filters;
