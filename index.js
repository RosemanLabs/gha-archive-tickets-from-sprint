import core from "@actions/core";
import GitHubProject from "github-project";

const run = async () => {
  try {
    const owner = core.getInput("owner");
    const number = Number(core.getInput("number"));
    const token = core.getInput("token");
    const iterationField = core.getInput("iteration-field"); // name of the iteration field
    const iterationType = core.getInput("iteration"); // last or current
    const statuses = core.getInput("statuses").split(",");

    const project = new GitHubProject({
      owner,
      number,
      token,
      fields: { iteration: iterationField },
    });

    const projectData = await project.getProperties();

    const lastIteration =
      projectData.fields.iteration.configuration.completedIterations[0];
    const currentIteration =
      projectData.fields.iteration.configuration.iterations[0];

    const iteration =
      iterationType === "last" ? lastIteration : currentIteration;

    const items = await project.items.list();

    const filteredItems = items.filter((item) => {
      // If item is not in the old iteration, return false.
      if (item.fields.iteration !== iteration.title) return false;
      // Move item only if its status _is_ in the statuses list.
      return statuses.includes(item.fields.status);
    });

    await Promise.all(
      filteredItems.map((item) => project.items.archive(item.id))
    );
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
