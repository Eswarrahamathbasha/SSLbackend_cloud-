const DataModel = require("../models/DataModel");

// ✅ Save Data (POST)
exports.createData = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newData = new DataModel({ name, email, message });
        await newData.save();
        res.json({ message: "Data stored successfully!", data: newData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to store data!" });
    }
};

// ✅ Fetch Data (GET)
exports.getData = async (req, res) => {
    try {
        const allData = await DataModel.find();
        res.json({ message: "Data retrieved successfully!", data: allData });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data!" });
    }
};

// ✅ Update Data (PUT)
exports.updateData = async (req, res) => {
    try {
        const updatedData = await DataModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({ error: "Data not found!" });
        }

        res.json({ message: "Data updated successfully!", data: updatedData });
    } catch (error) {
        res.status(500).json({ error: "Failed to update data!" });
    }
};

// ✅ Delete Data (DELETE)
exports.deleteData = async (req, res) => {
    try {
        const deletedData = await DataModel.findByIdAndDelete(req.params.id);

        if (!deletedData) {
            return res.status(404).json({ error: "Data not found!" });
        }

        res.json({ message: "Data deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete data!" });
    }
};
