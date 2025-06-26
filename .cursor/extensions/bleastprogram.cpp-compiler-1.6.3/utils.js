const util = require("util");
const exec = util.promisify(require("child_process").exec);

const executeCommand = async (cmd) => {
  try {
    const { stdout, stderr } = await exec(cmd);

    if (stderr) {
      if (stderr.toUpperCase().includes("WARNING")) {
        return { res: 0, msg: stderr };
      } else {
        return { res: 1, msg: stderr };
      }
    }

    return { res: 0, msg: stdout };
  } catch (err) {
    return { res: -1, msg: err };
  }
};

const getNameByPath = (path) => {
  if (path.includes("\\")) {
    return path.split("\\").at(-1);
  } else if (path.includes("/")) {
    return path.split("/").at(-1);
  }
};

module.exports = { executeCommand, getNameByPath };
