import {Router, Request, Response, NextFunction} from 'express'
import Auth from "../security/auth";
import {userRules} from '../models/user/validator';
import {RegistrationService} from "../services/registration.service";
import {matchedData} from "express-validator/filter";
import {UserInstance} from "../models/user/user.model";
import {validationResult} from "express-validator/check";

export const router = Router();

router.post('/login', userRules['forLogin'], Auth.login);

router.post('/register', userRules['forRegister'], async (req :Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      return res.status(422).json({"error": errors.array()});
  }

  const payload = matchedData(req) as UserInstance;

  const registrationService = new RegistrationService();

  try {
      const user = registrationService.register(payload);
      return user.then(u => res.json(u))
  } catch (error) {
      next(error)
  }
});

router.post('/token', Auth.refreshToken);