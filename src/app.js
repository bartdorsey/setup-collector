import express from 'express';
import volleyball from 'volleyball';
import { saveReport, getReportByEmail, updateReport } from './db.js';
import { serializeError } from 'serialize-error';
import { body, validationResult } from 'express-validator';

const app = express();

app.use(volleyball);
app.use(express.json());

const reportValidations = [
  body('email').isEmail().exists(),
  body('os').exists(),
  body('os_version').exists(),
  body('arch').exists(),
  body('shell').exists(),
  body('vscode').isBoolean(),
  body('postgres').isBoolean()
];

app.post('/report', reportValidations, async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(errors);
  }

  const {
    email,
    os,
    os_version,
    arch,
    node_version,
    node_path,
    shell,
    vscode,
    postgres,
    postgres_version
  } = req.body;
  try {
    const report = await getReportByEmail(email);
    if (report) {
      await updateReport({
        email,
        os,
        os_version,
        arch,
        node_version,
        node_path,
        shell,
        vscode,
        postgres,
        postgres_version,
      });
    } else {
      await saveReport({
        email,
        os,
        os_version,
        arch,
        node_version,
        node_path,
        shell,
        vscode,
        postgres,
        postgres_version
      });
    }
  } catch (e) {
    next(e);
    return;
  }
  res.send(200);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400);
  res.send(serializeError(err));
});

export default app;

