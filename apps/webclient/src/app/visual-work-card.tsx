import {
  Paper,
  styled,
} from '@mui/material';
import { ReactProps } from '@roanm/models';

interface VisualWorksCardProps extends ReactProps {
  name?: string;
  title?: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  overview: string;
  actor: string;
  character: string;
  vote_count: number;
}

const StyledVisualWorksCard = styled(Paper)({
  width: '400px',
  margin: '16px auto',
  padding: '16px',
});

export const VisualWorksCard = (props: VisualWorksCardProps) => {
  return (
    <StyledVisualWorksCard>
      <p>
        <em>{props.character} </em> in 
        <strong> ({props.title || props.name})</strong>
      </p>
      {props.poster_path && (
        <img
          loading="lazy"
          src={props.poster_path}
          width="400"
          alt={props.name || props.title}
        />
      )}
    </StyledVisualWorksCard>
  );
};
