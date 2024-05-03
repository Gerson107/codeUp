import eventModel from '../models/eventModel.js'
import user from '../models/userModel.js'
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

//Obtener eventos
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

//registrarse a un evento

export const enrollUserEvent = async (req, res) => {
 const userId = req.params.id
 const eventId = req.query.id
  try {
    const user = await user.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const event = await event.findById(eventId);
    if(!event) {
      return res.status(404).send({ message: "Event not found" });
    }

    if(event.attendees.includes(userId)) {
      return res.status(400).send({ message: "The user is already registered in this event" });
    }

    if (usuario.age < event.minimumAge) {
      return res.status(422).send({ message: "the user does not meet the minimum age for this event" });
    }

    event.attendees.push(userId)
    await event.save()
    return res.json({ success: true, message: 'successfully registered user' });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });

  }
}