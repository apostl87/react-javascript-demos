import React from 'react';

const SpaceGame = () => {
    return (
        <div align='center' className='p-5'>
            <h3 className='p-2'>
                Arcade Space Shooter in JavaScript
            </h3>
            <iframe title="Space Game" src="/SpaceGame/SpaceGame.html" width="610" height="420" />
            <div className='p-3'>
                <table className='table-space-game'>
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Spacebar</td>
                            <td>Fire</td>
                        </tr>
                        <tr>
                            <td>A / Left Arrow</td>
                            <td>Move left</td>
                        </tr>
                        <tr>
                            <td>D / Right Arrow</td>
                            <td>Move right</td>
                        </tr>
                        <tr>
                            <td>W / Up Arrow</td>
                            <td>Move up</td>
                        </tr>
                        <tr>
                            <td>S / Down Arrow</td>
                            <td>Move down</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='hr' />
            <div>
                The development of this game is the result of a typical instructive JavaScript <a href="https://www.youtube.com/watch?v=eWLDAAMsD-c">tutorial</a>.
            </div>
        </div >
    );
};

export default SpaceGame;