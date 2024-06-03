import { ModalInstance } from "../layout-utilities/Modal";

export const AboutModal = () => {
  return (<>
    <ModalInstance heading="about" actions={[]}>
      <p>Created by me, <a href="https://github.com/joelfeodiyoup">Joel Mundy</a>, just for fun. (can a game be made in the browser? I don't know yet)</p>
      <p>This was inspired very much by some games I loved when growing up:
        <ul className="list">
          <li><a href="https://store.steampowered.com/app/566050/Zeus__Poseidon/">Zeus: Master of Olympus</a>, and</li>
          <li><a href="https://www.openttd.org/">Transport Tycoon</a>, created by the great <a href="https://en.wikipedia.org/wiki/Chris_Sawyer">Chris Sawyer</a></li>
        </ul>
      </p>
    </ModalInstance>
  </>)
}
