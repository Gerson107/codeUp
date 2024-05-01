import eventModel from '../models/eventModel.js'
import fs from "fs";

export const eventController = async (req, res) => {
    try {
      const { place, date, name, description, attendees, minimumAge, organizer } =
        req.fields;
      const { photo } = req.files;
  
      // Validar datos de entrada
      if (
        !place ||
        !date ||
        !name ||
        !description ||
        !attendees ||
        !minimumAge ||
        !organizer 
      ) {
        return res.status(400).send({ message: "All fields are required" });
      }
      if (photo && photo.size > 1000000) {
        return res
          .status(400)
          .send({ message: "Photo is required and should be less than 1mb" });
      }
  
  
      //Crear nuevo evento
      const newEvent = await eventModel({
        place,
        date,
        name,
        description,
        attendees,
        minimumAge,
        organizer,
      });
  
      // Guardar foto si esta presente
      if (photo) {
        newEvent.photo.data = fs.readFileSync(photo.path);
        newEvent.photo.contentType = photo.type;
      }
  
      //Guardar evento en la base de datos
      await newEvent.save();
  
      res.status(201).send({
        success: true,
        message: "Event Created Successfully",
        event: newEvent,
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
export const getEventController = async (req, res) => {
    try {
        const event = await eventModel.find({})
        .populate('place')
        .populate('attendees')
        .populate('organizer')
        console.log('bien hecho', event)

        res.status(200).send({
            success: true,
            message: 'All events fetched',
            events: event,
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
