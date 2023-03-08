const TaskModel = require("../models/task.model");
const TaskDetailsModel = require("../models/taskDetails.model");
const { ObjectId } = require("mongodb");

exports.getAllTasks = async (id, role, user) => {
  if (role == "secretary") {
    return await TaskModel.find({
      assigners_id: id,
    }).sort({ createdAt: -1 });
  } else if (role == "sanitaryInspector") {
    return await TaskModel.find({
      ward: user.wardname,
    }).sort({ createdAt: -1 });
  } else {
    return await TaskModel.find().sort({ createdAt: -1 });
  }
};

exports.getTaskData = async (filter) => {
  const pageSize = filter.limit ? parseInt(filter.limit) : 0;
  const page1 = filter.page ? parseInt(filter.page) : 0;
  const page = page1 * pageSize;
  return await TaskModel.find({})
    .sort({ createdAt: -1 })
    .skip(page)
    .limit(pageSize);
};

exports.getAllTaskStatusCount = async () => {
  let startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  let endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  return await TaskModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startOfDay),
          $lte: new Date(endOfDay),
        },
      },
    },
    {
      $group: {
        _id: "$task_status",
        Count: {
          $count: {},
        },
      },
    },
  ]);
};

exports.getBarGraphDataList = async (filter) => {
  let sd = new Date(filter.startDate);
  let ed = new Date(filter.endDate);
  // console.log(sd, ed);
  let query = [
    {
      $match: {
        createdAt: {
          $gte: sd,
          $lte: ed,
        },
      },
    },
  ];
  if (filter.Zone != undefined && filter.Zone != null) {
    query.push({
      $match: {
        zone: {
          $in: filter.Zone,
        },
      },
    });
  }
  if (filter.Ward != undefined && filter.Ward != null) {
    query.push({
      $match: {
        ward: {
          $in: filter.Ward,
        },
      },
    });
  }
  if (filter.Swachlayam != undefined && filter.Swachlayam != null) {
    query.push({
      $match: {
        sachivalyam: {
          $in: filter.Swachlayam,
        },
      },
    });
  }
  query.push(
    {
      $sort: {
        updatedAt: -1,
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$updatedAt",
            },
          },
          status: "$task_status",
        },
        Count: {
          $count: {},
        },
      },
    },
    {
      $sort: {
        "_id.status": -1,
      },
    },
    {
      $group: {
        _id: "$_id.date",
        totalTask: {
          $sum: "$Count",
        },
        statusCount: {
          $push: "$Count",
        },
        status: {
          $push: "$_id.status",
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    }
  );

  return await TaskModel.aggregate(query);
};

exports.getPieGraphDataList = async (filter) => {
  let sd = new Date(filter.startDate);
  let ed = new Date(filter.endDate);
  // console.log(sd, ed);
  let query = [];
  query.push({
    $match: {
      createdAt: {
        $gte: sd,
        $lte: ed,
      },
    },
  });
  if (filter.Zone != undefined && filter.Zone != null) {
    query.push({
      $match: {
        zone: {
          $in: filter.Zone,
        },
      },
    });
  }
  if (filter.Ward != undefined && filter.Ward != null) {
    query.push({
      $match: {
        ward: {
          $in: filter.Ward,
        },
      },
    });
  }
  if (filter.Swachlayam != undefined && filter.Swachlayam != null) {
    query.push({
      $match: {
        sachivalyam: {
          $in: filter.Swachlayam,
        },
      },
    });
  }
  query.push({
    $group: {
      _id: "$task_status",
      count: {
        $count: {},
      },
    },
  });

  return await TaskModel.aggregate(query);
};

exports.getAllStatusTasks = async (id, role, user, query) => {
  if (role == "secretary") {
    return await TaskModel.find({
      assigners_id: id,
      task_status: query,
    }).sort({ createdAt: -1 });
  } else if (role == "sanitaryInspector") {
    return await TaskModel.find({
      ward: user.wardname,
      task_status: query,
    }).sort({ createdAt: -1 });
  } else {
    return await TaskModel.find({ task_status: query }).sort({ createdAt: -1 });
  }
};

exports.getTodaysTasks = async (id, role, user) => {
  var start = new Date();
  var s = start.setHours(0, 0, 0, 0);

  if (role == "secretary") {
    let statusCount = await TaskModel.aggregate([
      {
        $match: {
          assigners_id: ObjectId(id),
          createdAt: {
            $gte: new Date(s),
          },
        },
      },
      {
        $group: {
          _id: "$task_status",
          count: {
            $count: {},
          },
        },
      },
    ]);
    var totalTasks = 0;
    var OngoingTasks = 0;
    var InReviewTasks = 0;
    var CompletedTasks = 0;
    for (const iterator of statusCount) {
      totalTasks = totalTasks + iterator.count;
      if (iterator._id == "Completed") {
        CompletedTasks = CompletedTasks + iterator.count;
      } else if (iterator._id == "Ongoing") {
        OngoingTasks = OngoingTasks + iterator.count;
      } else if (iterator._id == "In-review") {
        InReviewTasks = InReviewTasks + iterator.count;
      }
    }
    let TaskList = await TaskModel.find({
      assigners_id: id,
      createdAt: { $gte: new Date(s) },
    }).sort({ createdAt: -1 });
    return {
      totaltask: totalTasks,
      completed: CompletedTasks,
      ongoing: OngoingTasks,
      inreview: InReviewTasks,
      tasks: TaskList,
    };
  } else if (role == "sanitaryInspector") {
    let statusCount = await TaskModel.aggregate([
      {
        $match: {
          ward: user.wardname,
          createdAt: {
            $gte: new Date(s),
          },
        },
      },
      {
        $group: {
          _id: "$task_status",
          count: {
            $count: {},
          },
        },
      },
    ]);
    var totalTasks = 0;
    var OngoingTasks = 0;
    var InReviewTasks = 0;
    var CompletedTasks = 0;
    for (const iterator of statusCount) {
      totalTasks = totalTasks + iterator.count;
      if (iterator._id == "Completed") {
        CompletedTasks = CompletedTasks + iterator.count;
      } else if (iterator._id == "Ongoing") {
        OngoingTasks = OngoingTasks + iterator.count;
      } else if (iterator._id == "In-review") {
        InReviewTasks = InReviewTasks + iterator.count;
      }
    }
    let TaskList = await TaskModel.find({
      ward: user.wardname,
      task_status: "In-review",
      createdAt: { $gte: new Date(s) },
    }).sort({ createdAt: -1 });
    return {
      totaltask: totalTasks,
      completed: CompletedTasks,
      ongoing: OngoingTasks,
      inreview: InReviewTasks,
      tasks: TaskList,
    };
  } else {
    let statusCount = await TaskModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(s),
          },
        },
      },
      {
        $group: {
          _id: "$task_status",
          count: {
            $count: {},
          },
        },
      },
    ]);
    var totalTasks = 0;
    var OngoingTasks = 0;
    var InReviewTasks = 0;
    var CompletedTasks = 0;
    for (const iterator of statusCount) {
      totalTasks = totalTasks + iterator.count;
      if (iterator._id == "Completed") {
        CompletedTasks = CompletedTasks + iterator.count;
      } else if (iterator._id == "Ongoing") {
        OngoingTasks = OngoingTasks + iterator.count;
      } else if (iterator._id == "In-review") {
        InReviewTasks = InReviewTasks + iterator.count;
      }
    }
    let TaskList = await TaskModel.find({
      createdAt: { $gte: new Date(s) },
    }).sort({ createdAt: -1 });
    return {
      totaltask: totalTasks,
      completed: CompletedTasks,
      ongoing: OngoingTasks,
      inreview: InReviewTasks,
      tasks: TaskList,
    };
  }
};

exports.getAllTaskNames = async () => {
  let taskNames = await TaskDetailsModel.aggregate([
    {
      $sort: {
        createdAt: 1,
      },
    },
    {
      $group: {
        _id: "$__v",
        taskList: {
          $push: "$task_name",
        },
      },
    },
  ]);
  var taskNamesList = [];
  for (const iterator of taskNames) {
    taskNamesList = iterator.taskList;
  }
  return taskNamesList;
};

exports.createTask = async (task) => {
  return await TaskModel.create(task);
};
exports.getTaskById = async (id) => {
  return await TaskModel.findById(id);
};

exports.updateTask = async (id, task) => {
  return await TaskModel.findByIdAndUpdate(id, task);
};

exports.deleteTask = async (id) => {
  return await TaskModel.findByIdAndDelete(id);
};

exports.getUserTaskCount = async (id) => {
  return await TaskModel.findByIdAndDelete(id);
};
