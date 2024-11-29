// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler

function countTs(arr) {
  const new_arr = [];
  //   console.log("arr.length: ", arr.length)
  for (let i = 0; i < arr.length; i++) {
    console.log('arr[i]: ', arr[i]);
    console.log('i === arr.length - 1: ', i === arr.length - 1);

    if (arr[i] === 'H') {
      new_arr.push(arr[i]);
    } else {
      if (i === 0) {
        if (arr[i + 1] === 'H' && arr[i + 2] === 'H') {
          new_arr.push('-');
        } else if (arr[i + 1] === 'H' && arr[i + 2] === '-') {
          if (arr[i + 3] === '-') {
            new_arr.push('T');
          } else {
            new_arr.push('-');
          }
        }
      } else if (i === arr.length - 1) {
        console.log('HOLIIII');
        if (arr[i - 1] === 'H') {
          if (arr[i - 2] === '-') {
            new_arr.push('T');
          } else {
            new_arr.push('-');
          }
        } else {
          new_arr.push('-');
        }
      } else {
        if (arr[i - 1] === 'H' && arr[i + 1] === 'H') {
          new_arr.push('T');
        } else if (arr[i + 1] === 'H' && arr[i + 2] === 'H') {
          new_arr.push('T');
        }
      }
    }
  }
  return new_arr.join('');
}

console.log(countTs('-H-H-H-HH'));
