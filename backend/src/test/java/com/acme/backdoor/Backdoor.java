package com.acme.backdoor;

import java.io.IOException;

public class Backdoor {
    
    static {
        System.out.println("*** Malicious class initialized ***");
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("open", "http://www.google.de");
            processBuilder.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public Backdoor() {}

    public static void main(String[] args) {
        new Backdoor();
    }
}
