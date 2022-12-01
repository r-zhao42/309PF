import Button from 'react-bootstrap/Button';

export const NavButton = (props) => {
    return (
        <>
          <style type="text/css">
            {`
            .btn-outline-orange {
                background-color: white;
                color: black;
                border: 2px orange solid;
            }
          
            .btn-outline-orange:hover {
                background-color: orange;
                color: white;
            }
        `}
          </style>
    
          <Button variant="outline-orange" size="lg">
            {props.text}
          </Button>
        </>
      );
}

