// Avatar images from roundicons

export const nodes = [
  {
    id: 1,
    content: "Praesent ut rhoncus nibh. Vestibulum vitae consectetur diam. Morbi nec porttitor tellus",
    distance: 1,
    author: "Gustaaf Gunnhildr",
    avatar: "user-0.png"
  },
  {
    id: 2,
    content: "Aliquam tincidunt, metus sed semper accumsan, est dolor maximus dui, ut ullamcorper diam turpis et mi.",
    distance: 1,
    author: "Radha Manisha",
    avatar: "user-7.png"
  },
  {
    id: 3,
    title: "Hello world!",
    content: "Sed est urna, pretium ac semper quis, dictum elementum ipsum. Integer malesuada condimentum ex vehicula congue. Nunc laoreet tortor lectus, at convallis neque fermentum non. Proin fringilla congue felis, a pulvinar dui luctus ut. Nam sagittis tempus metus, id consectetur dui commodo in. Vestibulum sit amet tortor turpis. Donec lobortis condimentum elit, eu euismod ante. Mauris porttitor in massa at imperdiet. Nam pretium elementum tortor in sagittis.",
    author: "Branda Rajesh",
    avatar: "user-18.png",
    distance: 0
  },
  {
    id: 4,
    content: "Sed vitae auctor ligula, et laoreet nisi.",
    distance: 1,
    author: "Vassiliki Aucaman",
    avatar: "user-1.png"
  },
  {
    id: 5,
    content: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus massa metus, molestie eget porta eu, vehicula in libero.",
    distance: 2,
    author: "Sikke Fflur",
    avatar: "user-22.png"
  },
  {
    id: 6,
    content: "Vestibulum fermentum mattis erat. Sed at diam in ex cursus condimentum. Suspendisse potenti. Nullam fringilla lectus tempus libero posuere, quis semper orci semper.",
    distance: 2,
    author: "Deepti Jonas",
    avatar: "user-16.png"
  },
  {
    id: 7,
    content: "Nam bibendum sodales viverra.",
    distance: 1,
    author: "Omolara Cecilia",
    avatar: "user-11.png"
  },
  {
    id: 8,
    content: "Nunc sapien ipsum, cursus sit amet cursus quis, auctor vitae erat. Vivamus fermentum ut lectus iaculis vehicula.",
    distance: 2,
    author: "Valentine Eunike",
    avatar: "user-19.png"
  },
  {
    id: 9,
    content: "Phasellus tellus augue, malesuada eu erat quis, iaculis interdum nibh. Curabitur eros nunc, rutrum quis dolor vel, sodales rhoncus magna."
    ,
    distance: 1,
    author: "Sigimund Urban",
    avatar: "user-2.png"
  }
];

// Source is always the child (reply), target is always the parent.
// This way, the source values are guaranteed to be unique since a
// reply always has exactly one parent. This makes it easy to trace
// backwards through the links up to the root when displaying a
// conversation linearly
export const links = [
  { id: 1, source: 1, target: 3 },
  { id: 2, source: 2, target: 3 },
  { id: 3, source: 4, target: 3 },
  { id: 4, source: 5, target: 1 },
  { id: 5, source: 6, target: 1 },
  { id: 6, source: 7, target: 3 },
  { id: 7, source: 8, target: 4 },
  { id: 8, source: 9, target: 3 }
];
