import Task from "../models/taskmodels.js";

import User from "../models/usermodels.js";

export const getTasks = async (req, res) => {
  try {
    let query = JSON.stringify(req.query);

    //ama bo awaya la req.query kaya bysrynawa boy find ka eshkat
    let excluteQuery = ["sort", "fields", "page", "limit", "search", "id"];
    //bo nwsyny gte ...
    query = query.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    let queryObj = JSON.parse(query);
    excluteQuery.forEach((i) => {
      delete queryObj[i];
    });

    if (req.query.search) {
      queryObj.fullName = new RegExp(req.query.search, "i");
    }

    if (req.query.id) {
      queryObj._id = req.query.id;
    }

    const getQuery = Task.find(queryObj);

    const count = await getQuery.clone().count();

    //bo sort krdna
    if (req.query.sort) {
      getQuery.sort(req.query.sort);
    }
    //id

    //ama bo awaya ka tanha datay aw row wana bgarenetawa ka yawtate bo nmwna name image price
    if (req.query.fields) {
      getQuery.select(req.query.fields);
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 15;

    const skip = limit * (page - 1);

    getQuery.skip(skip).limit(limit);
    const task = await getQuery;

    res.status(200).json({
      stastus: "success",
      NumberOfData: count,
      data: task,
    });
  } catch (err) {
    res.status(404).json({ stastus: "error", message: "task not found" });
  }
};

export const updatetask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedtask = req.body;

    const task = await Task.findByIdAndUpdate(taskId, updatedtask, {
      new: true,
    });

    if (!task) {
      return res
        .status(404)
        .json({ status: "error", message: "task not found" });
    }

    res.status(200).json({ status: "success", data: task });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
export const addtask = async (req, res) => {
  try {
    const data = await Task.create(req.body);

    res.status(201).json({
      status: "success",
      data: data,
    });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

export const deletetask = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Find the task by ID and delete it
    const deletedtask = await Task.findByIdAndDelete(taskId);

    if (!deletedtask) {
      // If the task is not found, return an error response
      return res
        .status(404)
        .json({ status: "error", message: "task not found" });
    }

    // Remove the task reference from related models (e.g., brand and category)
    await User.updateOne(
      { _id: deletedtask.task },
      { $pull: { task: deletedtask._id } }
    );

    // Return success response
    res
      .status(200)
      .json({ status: "success", message: "task deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
