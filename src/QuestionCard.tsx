import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import * as React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Question } from "@/src/state";
import { Unstable_Grid2 as Grid2 } from "@mui/material";

export const QuestionCard = ({ question }: { question: Question }) => {
  return (
    <Card style={{ height: "100%" }}>
      <CardHeader title={question.title} titleTypographyProps={{fontSize: "h6.fontSize"}} />
      {question.content && (
        <CardContent>
          <ReactMarkdown
            // eslint-disable-next-line react/no-children-prop
            children={question.content as string}
            components={{
              img: ({ src, alt, title }) => (
                <CardMedia
                  component="img"
                  image={src}
                  alt={alt}
                  title={title}
                />
              ),
            }}
          />
        </CardContent>
      )}
      <CardContent>
        <FormControl>
          <RadioGroup name={question.id}>
              {question.choices.map((choice, index) => (
                <FormControlLabel
                  key={index}
                  value={choice}
                  control={<Radio />}
                  label={choice}
                />
              ))}
          </RadioGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
};
