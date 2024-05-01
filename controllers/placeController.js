import placeModel from '../models/placeModel.js'
import fs from "fs";

export const placeController = async (req, res) => {
    try {
      const { name, address, date, occupancy, } =
        req.fields;
      const { photo } = req.files;
  
      // Validar datos de entrada
      if (
        !name ||
        !address ||
        !date ||
        !occupancy
      ) {
        return res.status(400).send({ message: "All fields are required" });
      }
      if (photo && photo.size > 1000000) {
        return res
          .status(400)
          .send({ message: "Photo is required and should be less than 1mb" });
      }
  
  
      //Crear nuevo lugar
      const newPlace = await placeModel({
        name,
        address,
        date,
        occupancy,
      });
  
      // Guardar foto si esta presente
      if (photo) {
        newPlace.photo.data = fs.readFileSync(photo.path);
        newPlace.photo.contentType = photo.type;
      }
  
      //Guardar lugar en la base de datos
      await newPlace.save();
  
      res.status(201).send({
        success: true,
        message: "Place Created Successfully",
        place: newPlace,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: "Error in created",
        error: error.message,
      });
    }
  };

//Obtener lugares
export const getPlaceController = async (req, res) => {
    try {
        const place = await placeModel.find({}).populate('date').exec();
        res.status(200).send({
            success: true,
            message: 'All places fetched',
            place: place,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Eror while getitng single product",
          error,
        });
    }
}

