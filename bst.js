/**
 * Node class that will create a node with
 * a value, and a reference to its right
 * and left child.
 */
class Node {
  // All private properties
  #value;
  #leftNode;
  #rightNode;

  /**
   * Constructor
   *
   * @param {Number} value - Value of node
   */
  constructor(value) {
    this.#value = value;
    this.#rightNode = null;
    this.#leftNode = null;
  }

  // Setters

  /**
   * Sets reference to left child.
   */
  set leftNode(node) {
    if (node === null || node instanceof Node) {
      this.#leftNode = node;
    }
  }

  /**
   * Sets reference to right child.
   */
  set rightNode(node) {
    if (node === null || node instanceof Node) {
      this.#rightNode = node;
    }
  }

  /**
   * Sets value of node.
   */
  set value(value) {
    this.#value = value;
  }

  // Getters

  /**
   * Gets reference to left node.
   */
  get leftNode() {
    return this.#leftNode;
  }

  /**
   * Gets reference to right node.
   */
  get rightNode() {
    return this.#rightNode;
  }

  /**
   * Gets value of node
   */
  get value() {
    return this.#value;
  }
}

/**
 * Tree class that accepts an array when initialized to
 * build a binary search tree.
 */
class Tree {
  // Root node will be private
  #root;

  /**
   * Constructor
   *
   * @param {Array} arr - Array used to build tree
   */
  constructor(arr = []) {
    let newArr = this.#sortArray(this.#removeDups(arr));
    this.#root = this.#buildTree(newArr, 0, newArr.length - 1);
  }

  /**
   * Takes an array and builds a balanced binary tree
   * populated with Node objects.
   *
   * @param {Array} arr - Array used to build tree
   * @param {Number} start - Start index of array
   * @param {Number} end - End index of array
   * @returns - The root node of the tree
   */
  #buildTree(arr, start, end) {
    // Once array is empty, return null pointer
    if (start > end) return null;

    // Get middle point
    let mid = Math.floor((start + end) / 2);
    // Get middle value
    let value = arr[mid];
    // Set root node with middle value
    let node = new Node(value);

    // Recursively build the left and right subtrees
    node.leftNode = this.#buildTree(arr, start, mid - 1);
    node.rightNode = this.#buildTree(arr, mid + 1, end);

    return node;
  }

  /* Remove duplicate elements in an array */
  #removeDups(arr) {
    /**
     * Create an array of unique values using a Set object
     */
    return [...new Set(arr)];
  }

  /** Sort array in ascending order */
  #sortArray(arr) {
    return arr.sort((a, b) => {
      return a - b;
    });
  }

  /**
   * Insert a new node with a unique value by traversing the
   * tree until the appropriate leaf node is found.
   *
   * @param {Number} value - Value of node to be inserted
   * @param {Node} node - Parent of node to be inserted
   * @returns - Node object
   */
  insert(value, node = this.#root) {
    // Once leaf node is found, create new node and return it
    if (node === null) {
      node = new Node(value);
      return node;
    } else if (value === node.value) {
      // If node with value already exists, exit
      console.log("Node with value already exists");
      return;
    }

    // Recursively traverse the tree
    if (value < node.value) {
      node.leftNode = this.insert(value, node.leftNode);
    } else if (value > node.value) {
      node.rightNode = this.insert(value, node.rightNode);
    }
  }

  /**
   * Deletes a node with passed in value from tree
   * depending on various conditions.
   *
   * @param {Number} value - Value of node to
   * @param {Node} node - Parent of node to be deleted
   * @returns - Node object
   */
  delete(value, node = this.#root) {
    //If value being deleted is not found, exit
    if (node === null) {
      return;
    }

    // Recursively traverse the tree
    if (value < node.value) {
      node.leftNode = this.delete(value, node.leftNode);
    } else if (value > node.value) {
      node.rightNode = this.delete(value, node.rightNode);
    } else {
      // Assuming we found the node...

      // If node only has only child OR is a leaf
      if (node.leftNode === null) {
        // Replace node with right child
        return node.rightNode;
      } else if (node.rightNode === null) {
        //Replace node with left child
        return node.leftNode;
      }

      /**  If node has two children, set its value to its successor's
       *   then delete node with successor value. Successor is always
       *   the node with the next lowest value.
       */
      node.value = this.#findMinValue(node.rightNode);

      //Use right node as root to find successor node and delete
      node.rightNode = this.delete(node.value, node.rightNode);

      return node;
    }
  }

  /**
   * Finds a node with a given value.
   *
   * @param {Number} value - Value of node to be searched
   * @returns
   */
  find(value) {
    //Start from root
    let node = this.#root;

    // Until there is a null pointer reached or value is found...
    while (node !== null) {
      if (value === node.value) {
        return node;
        // Traverse tree if value is not found
      } else if (value < node.value) {
        node = node.leftNode;
      } else if (value > node.value) {
        node = node.rightNode;
      }
    }

    return `Could not find node with value of ${value}.`;
  }

  /**
   * Traverse the tree in a breath-first level order.
   *
   * @param {Array} queue - Array representing queue of nodes to be visited
   * @param {Array} arr - Array of values representing traversal order
   * @returns - arr parameter
   */
  levelOrder(queue = [this.#root], arr = []) {
    //If front of queue is empty, return traversal array
    if (!queue[0]) {
      return arr;
    }

    //Store reference to node in front of queue
    let tmp = queue[0];
    arr.push(tmp.value);

    //Remove node in front of queue
    queue.shift();

    //If there is a left child, add to queue
    if (tmp.leftNode !== null) {
      queue.push(tmp.leftNode);
    }

    //If there is a right child, add to queue
    if (tmp.rightNode !== null) {
      queue.push(tmp.rightNode);
    }

    return this.levelOrder(queue, arr);
  }

  /**
   * Calls recursive function for in-order traversal.
   *
   * @returns - Array of values representing traversal order
   */
  inorder() {
    return this.#inorderRec(this.#root);
  }

  /**
   * Traverses the tree in a depth-first order using the
   * in-order algorithm.
   *
   * @param {Node} node - Node object to be visited
   * @param {Array} arr - Array of values representing traversal order
   * @returns - arr parameter
   */
  #inorderRec(node, arr = []) {
    if (node === null) return;

    // First visit left subtree, then root, and lastly right subtree
    this.#inorderRec(node.leftNode, arr);
    arr.push(node.value);
    this.#inorderRec(node.rightNode, arr);

    return arr;
  }

  /**
   * Calls the function for pre-order traversal.
   *
   * @returns - Array of values representing traversal order
   */
  preorder() {
    return this.#preorderRec(this.#root);
  }

  /**
   * Traverses the tree in a depth-first order using the
   * pre-order algorithm.
   *
   * @param {Node} node - Node object to be visited
   * @param {Array} arr - Array of values representing traversal order
   * @returns - arr parameter
   */
  #preorderRec(node, arr = []) {
    if (node === null) return;

    // First visit root, left subtree, and lastly right subtree
    arr.push(node.value);
    this.#preorderRec(node.leftNode, arr);
    this.#preorderRec(node.rightNode, arr);

    return arr;
  }

  /**
   * Calls the function for post-order traversal
   *
   * @returns - Array of values representing traversal order
   */
  postorder() {
    return this.#postorderRec(this.#root);
  }

  /**
   * Traverses the tree in a depth-first order using the
   * post-order algorithm.
   *
   * @param {Node} node - Node object to be visited
   * @param {Array} arr - Array of values representing traversal order
   * @returns - arr parameter
   */
  #postorderRec(node, arr = []) {
    if (node === null) return;

    // First visit left subtree, then right subtree, and lastly root
    this.#postorderRec(node.leftNode, arr);
    this.#postorderRec(node.rightNode, arr);
    arr.push(node.value);

    return arr;
  }

  /**
   * Call the function to calculate height of a node
   *
   * @param {Node} node - Node to be checked
   * @returns - Height of node
   */
  height(node = this.#root) {
    return this.#heightRec(node);
  }

  /**
   * Recursive function that will count edges in longest
   * path to a leaf node.
   *
   * @param {Node} node - Node along path
   * @returns - Edges in path
   */
  #heightRec(node) {
    /* When leaf node is reached accommodate for edge to 
       null pointer by subtracting 1 and if leaf node is 
       passed as parameter set its height to -1*/
    if (node === null) {
      return -1;
    }

    // Will return number of edges in longest path to a leaf node
    return (
      Math.max(
        this.#heightRec(node.leftNode),
        this.#heightRec(node.rightNode)
      ) + 1
    );
  }

  /**
   * Calculates the depth of a node.
   *
   * @param {Node} node - Node object to be checked
   * @returns - Depth of node
   */
  depth(node = this.#root) {
    // Start from root node
    let tmp = this.#root;

    let depth = 0;

    /**
     * Count number of edges from root node
     */
    while (tmp !== null && tmp.value !== node.value) {
      node.value > tmp.value ? (tmp = tmp.rightNode) : (tmp = tmp.leftNode);

      depth++;
    }

    //If node could not be found, return error string
    return tmp !== null ? depth : "Invalid node.";
  }

  /**
   * Checks if tree is balanced.
   *
   * @returns - If tree is balanced
   */
  isBalanced() {
    // Get height of left and right subtrees
    let leftHeight = this.height(this.#root.leftNode);
    let rightHeight = this.height(this.#root.rightNode);

    //Get difference of both subtrees height
    let diff = Math.abs(leftHeight - rightHeight);

    // If difference is greater than 1, tree is not balanced
    return diff < 1 ? true : false;
  }

  /**
   * Checks if tree is balanced and rebalances it.
   */
  rebalance() {
    if (this.isBalanced() === false) {
      /**
       * Traverse the tree using in-order algorithm and use
       * returned array to build new tree.
       **/
      let sortedArr = this.inorder();
      // buildTree() will return the root node of new tree
      this.#root = this.#buildTree(sortedArr, 0, sortedArr.length - 1);
    }
  }

  /**
   * Find smallest value in node's subtree
   */
  #findMinValue(node) {
    while (node.leftNode !== null) {
      node = node.leftNode;
    }

    return node.value;
  }

  /**
   * Function provided by TheOdinProject
   *
   * Prints a visual representation of tree.
   */
  #prettyPrint(node, prefix = "", isLeft = true) {
    if (node.rightNode !== null) {
      this.#prettyPrint(
        node.rightNode,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.leftNode !== null) {
      this.#prettyPrint(
        node.leftNode,
        `${prefix}${isLeft ? "    " : "│   "}`,
        true
      );
    }
  }

  // Calls function to print tree.
  printTree() {
    this.#prettyPrint(this.#root);
  }
}

//Driver function to test code
function main() {
  let arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
  let tree = new Tree(arr);

  tree.printTree();
  console.log(
    tree.isBalanced() ? "Tree is balanced." : "Tree is not balanced."
  );

  console.log(`Pre order traversal: \n${tree.inorder().join(", ")}`);
  console.log(`Post order traversal: \n${tree.postorder().join(", ")}`);
  console.log(`In order traversal: \n${tree.inorder().join(", ")}`);

  // Add seven random numbers to tree
  let i = 0;
  while (i < 7) {
    tree.insert(Math.floor(Math.random() * (200 - 100) + 100));
    i++;
  }

  tree.printTree();
  console.log(
    tree.isBalanced() ? "Tree is balanced." : "Tree is not balanced."
  );
  tree.rebalance();
  tree.printTree();
  console.log(
    tree.isBalanced() ? "Tree is balanced." : "Tree is not balanced."
  );
  console.log(`Pre order traversal: \n${tree.inorder().join(", ")}`);
  console.log(`Post order traversal: \n${tree.postorder().join(", ")}`);
  console.log(`In order traversal: \n${tree.inorder().join(", ")}`);
}

main();
