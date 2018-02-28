import React  from 'react';
import DevStampModal from './DevStampModal'
import {Container} from 'reactstrap'

const DevStamp = ({handleAlert}) =>
        <Container>
            <h5>
                Fix stamp
            </h5>
            <DevStampModal handleAlert={handleAlert}/>
        </Container>
;

export default DevStamp;