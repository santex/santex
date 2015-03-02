/*
function mergesort(lst, left, right) {
  if (!left) {
    left = 0;
  }
  if (right === undefined) {
    right = lst.length - 1;
  }
  if (left >= right) {
    return;
  }
  var middle = Math.floor((left + right) / 2);
  mergesort(lst, left, middle);
  mergesort(lst, middle + 1, right);
  var i = left, end_i = middle, j = middle + 1;
  while (i <= end_i && j <= right) {
    if (lst[i] < lst[j]) {
      i++;
      continue;
    }
    lst[i] = lst[j];
    lst
  }
def mergesort(lst, left=0, right=None):
    if right is None:
        right = len(lst) - 1
    if left >= right:
        return
    middle = (left + right) // 2
    mergesort(lst, left, middle)
    mergesort(lst, middle + 1, right)
    i, end_i, j = left, middle, middle + 1
    while i <= end_i and j <= right:
        if lst[i] < lst[j]:
            i += 1
            continue
        lst[i], lst[i+1:j+1] = lst[j], lst[i:j]
        lst.log()
        i, end_i, j = i + 1, end_i + 1, j + 1
*/

/**
 * Sorts the specified array using bottom-up mergesort, returning an array of
 * arrays representing the state of the specified array after sequential passes.
 * The first pass is performed at size = 2.
 */
function mergesort(array) {
  var passes = [array.slice()], size = 2;
  for (; size < array.length; size <<= 1) {
    for (var i = 0; i < array.length;) {
      merge(array, i, i + (size >> 1), i += size);
    }
    passes.push(array.slice());
  }
  merge(array, 0, size >> 1, array.length);
  passes.push(array.slice());

  /** Merges two adjacent sorted arrays in-place. */
  function merge(array, start, middle, end) {
    for (; start < middle; start++) {
      if (array[start] > array[middle]) {
        var v = array[start];
        array[start] = array[middle];
        insert(array, middle, end, v);
        passes.push(array.slice());
      }
    }
  }

  /** Inserts the value v into the subarray specified by start and end. */
  function insert(array, start, end, v) {
    while (start + 1 < end && array[start + 1] < v) {
      var tmp = array[start];
      array[start] = array[start + 1];
      array[start + 1] = tmp;
      start++;
    }
    array[start] = v;
  }

  return passes;
}
