export default {
  findItemById: function(collection, id, _id_prop) {
    var id_prop = _id_prop || "id";
    return collection.find(x => x && x[id_prop] === id);
  },
  findIndexById: function(collection, id) {
    var index;
    collection.find((x, i) => {
      index = i;
      return x._id === id;
    });
    return index;
  }
};