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
    console.log(JSON.stringify(projectData, null, 2));

    const configuration = projectData.fields.iteration.configuration;
    const iteration =
      iterationType === "last"
        ? configuration.completedIterations[0]
        : configuration.iterations[0];

    const items = await project.items.list();

    const filteredItems = items.filter((item) => {
      // If item is not in the old iteration, return false.
      if (item.fields.iteration !== iteration.title) return false;
      // Move item only if its status _is_ in the statuses list.
      return statuses.includes(item.fields.status);
    });

    console.log(
      `Archiving ${filteredItems.length} items from iteration ${iteration.title} with statuses ${statuses}...`
    );
    await Promise.all(
      filteredItems.map((item) => project.items.archive(item.id))
    );
    console.log(
      `Successfully archived items ${filteredItems
        .map((item) => item.id)
        .join(", ")}.`
    );
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
