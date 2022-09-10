import { Select } from "@chakra-ui/react";
const Filters = ({ setFilter, isLoading }) => {
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

export default Filters