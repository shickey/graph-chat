// Avatar images from roundicons

// @TODO: Move author info out of topics and replies?
//        Maybe make authors an object inside threads?

export const topics = {
  1: {
    title: "Hello world!",
    root: 3,
    author: "Branda Rajesh",
    avatar: "user-18.png"
  }
}

export const threads = {
  1: { // Topic ID
    1: { // Post IDs
      content: "Praesent ut rhoncus nibh. Vestibulum vitae consectetur diam. Morbi nec porttitor tellus",
      author: "Gustaaf Gunnhildr",
      avatar: "user-0.png",
      parent: 3,
      children: {
        5: true,
        6: true
      }
    },
    2: {
      content: "Aliquam tincidunt, metus sed semper accumsan, est dolor maximus dui, ut ullamcorper diam turpis et mi.",
      author: "Radha Manisha",
      avatar: "user-7.png",
      parent: 3,
      children: {}
    },
    3: {
      content: "Sed est urna, pretium ac semper quis, dictum elementum ipsum. Integer malesuada condimentum ex vehicula congue. Nunc laoreet tortor lectus, at convallis neque fermentum non. Proin fringilla congue felis, a pulvinar dui luctus ut. Nam sagittis tempus metus, id consectetur dui commodo in. Vestibulum sit amet tortor turpis. Donec lobortis condimentum elit, eu euismod ante. Mauris porttitor in massa at imperdiet. Nam pretium elementum tortor in sagittis.",
      author: "Branda Rajesh",
      avatar: "user-18.png",
      parent: null,
      children: {
        1 : true,
        2 : true,
        4 : true,
        7 : true,
        9 : true
      }
    },
    4: {
      content: "Sed vitae auctor ligula, et laoreet nisi.",
      author: "Vassiliki Aucaman",
      avatar: "user-1.png",
      parent: 3,
      children: {
        8: true
      }
    },
    5: {
      content: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus massa metus, molestie eget porta eu, vehicula in libero.",
      author: "Sikke Fflur",
      avatar: "user-22.png",
      parent: 1,
      children: {}
    },
    6: {
      content: "Vestibulum fermentum mattis erat. Sed at diam in ex cursus condimentum. Suspendisse potenti. Nullam fringilla lectus tempus libero posuere, quis semper orci semper.",
      author: "Deepti Jonas",
      avatar: "user-16.png",
      parent: 1,
      children: {}
    },
    7: {
      content: "Nam bibendum sodales viverra.",
      author: "Omolara Cecilia",
      avatar: "user-11.png",
      parent: 3,
      children: {}
    },
    8: {
      content: "Nunc sapien ipsum, cursus sit amet cursus quis, auctor vitae erat. Vivamus fermentum ut lectus iaculis vehicula.",
      author: "Valentine Eunike",
      avatar: "user-19.png",
      parent: 4,
      children: {}
    },
    9: {
      content: "Phasellus tellus augue, malesuada eu erat quis, iaculis interdum nibh. Curabitur eros nunc, rutrum quis dolor vel, sodales rhoncus magna."
      ,
      author: "Sigimund Urban",
      avatar: "user-2.png",
      parent: 3,
      children: {}
    }
  }
}
