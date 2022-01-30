import {
  Paper,
  styled,
} from '@mui/material';
import { ReactProps } from '@roanm/models';

interface CharacterCardProps extends ReactProps {
    name: string;
    character: string;
    profilePath: string;
    onClick?: () => void;
}

const StyledCharacterCard = styled(Paper)({
    width: '400px',
    margin: '16px auto',
    padding: '16px',
})

export const CharacterCard = (props: CharacterCardProps) => {
    return <StyledCharacterCard onClick={props.onClick}>
        <p>{props.character} ({props.name})</p>
        <img src={props.profilePath} width="400" alt={props.name} />
    </StyledCharacterCard>
};

