const set = (key = "", item = "") => {
  localStorage.setItem(key, item);
};

const get = (key = "") => {
  return localStorage.getItem(key);
};

const remove = (key = "") => {
  localStorage.removeItem(key);
};

const empty = () => {
  localStorage.empty();
};

const getObject = (key) => {
  const item = get(key);
  if (item) {
    return JSON.parse(item);
  }
  return null;
};

const setObject = (key, obj) => {
  add(key, JSON.stringify(obj));
};

export default { set, get, remove, empty, getObject, setObject };
